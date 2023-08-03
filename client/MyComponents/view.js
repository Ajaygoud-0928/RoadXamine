import React, { useState, useRef } from "react";
import { db } from "./config/firebase";
import { collection, getDocs, query, where, Timestamp, setDoc, doc } from "firebase/firestore";
import { PieChart, Pie, Tooltip, Legend, Cell, XAxis, YAxis, Line, LineChart, CartesianGrid } from 'recharts'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './view.css';
function View() {
    document.title = "RoadXamine-View"
    const [result, setResult] = useState([]);
    const [state, setState] = useState(false);

    const [chartData, setChartData] = useState([]);

    const [timelineData, setTimelineData] = useState([]);
    const [timelineDataStatus, setTimelineDataStatus] = useState(false);

    const [timelineRecovered, setTimelineRecovered] = useState([]);

    const [recoveredRoads, setRecoveredRoads] = useState([])

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [timerelatedData, setTimerelatedData] = useState([])

    const [timerelatedDataRecovered, setTimerelatedDataRecovered] = useState([])

    const [labelData, setLabelData] = useState("")
    const [filteredData, setFilteredData] = useState([]);

    const [recoveredByOfficer, setRecoveredByOfficer] = useState([]);

    const [complaintData, setComplaintData] = useState("")
    const [email, setEmail] = useState('')
    const [complaintStatus, setComplaintStatus] = useState(false)

    const scrollRef = useRef(null);
    const officerRef = collection(db, 'Officer')
    const DamagedCollectionRef = collection(db, 'Damages')
    const complaintRef = doc(collection(db, "Complaints"));

    /**Table data */
    function DisplayTable({ damages, isForRecoveredRoads }) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>CameraId</th>
                        <th>Location</th>
                        <th>Details</th>
                        <th>Officer Mail</th>
                        {!isForRecoveredRoads ? <th>Image</th> : null}
                        <th>Condition</th>
                    </tr>
                </thead>
                <tbody>
                    {damages.map((data, index) => (
                        <tr key={index}>
                            <td>{data.CameraId}</td>
                            <td>{<button onClick={() => {
                                const lat = data.Location._lat;
                                const long = data.Location._long;
                                const url = 'https://maps.google.com/maps?q='+ lat +" "+ long;
                                window.open(url,'_blank')
                            }} className="Imagebutton">Show Map</button>
                            }</td>
                            <td>{new Date(data.Details.seconds * 1000).toLocaleString()}</td>
                            <td>{data.OfficerId}</td>
                            {!isForRecoveredRoads ? <td><button onClick={() => window.open(data.ImageUrl)} className="Imagebutton">Open Image</button></td> : null}
                            <td>
                                {data.Status === 'Damaged' ?
                                    <button className="damaged">Open Image</button>
                                    : data.Status === 'Recovered' ?
                                        <button className="recovered">Open Image</button>
                                        : data.Status === 'Under Recovery' ?
                                            <button className="uc">Open Image</button>
                                            : null
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        );

    }
    /**Function for displaying a timeline chart */
    function DisplayChart({ data }) {
        return (
            <LineChart width={800} height={400} data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="5 5" />
                <Line type="monotone" dataKey="count" stroke="grey" />
            </LineChart>
        )
    }
    /* For getting the all the details of damaged roads */
    const getData = async () => {
        if (result.size > 0)
            return;
        const q = query(DamagedCollectionRef);
        try {
            const data = await getDocs(q)
            const res = []
            data.forEach(element => {
                res.push(element.data())
            })
            setResult(res);
            console.log(result)
        }
        catch (error) {
            console.log(error)
        }
    }
    /**Officer data */
    const getOfficerData = async (inputValue) => {
        try {
            const q = query(officerRef);
            const data = await getDocs(q);
            const res = [];

            data.forEach((doc) => {
                const docData = doc.data();
                if (docData.Division === inputValue || docData.State === inputValue || docData.District === inputValue) {
                    res.push(docData.Email);
                }
            });
            await getData();
            setFilteredData(result.filter(temp => res.includes(temp.OfficerId)))
        } catch (error) {
            console.log(error)
        }
    }

    const generateRandomColors = (length) => {
        const colors = [];
        for (let i = 0; i < length; i++) {
            const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
            colors.push(randomColor);
        }
        return colors;
    };
    /** Genrating pie chart for representing the damages of each officer */
    const generateChartData = async () => {
        await getData();
        const officerReports = result.reduce((reports, item) => ({
            ...reports,
            [item.OfficerId]: (reports[item.OfficerId] || 0) + 1,
        }), {});
        const officers = Object.keys(officerReports);
        const colors = generateRandomColors(officers.length);


        const q = query(officerRef, where("Email", "in", officers));
        const querySnapshot = await getDocs(q);
        const chartData = []
        querySnapshot.forEach(element => {
            const officer = element.data().Email;
            chartData.push({
                name: element.data().Division,
                value: officerReports[officer],
                color: colors[officers.indexOf(officer)],
            })
        });
        setChartData(chartData);
    };
    /** Genrating chart to represent the damgaged represented as per time/date */
    const getDamagedReports = async (emailAddresses) => {
        const querySnapshot = await getDocs(collection(db, "Damages"));
        const damagedReports = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            date: doc.data().Details.toDate().toLocaleDateString(),
        }));

        let filteredReports = damagedReports;

        if (emailAddresses && emailAddresses.length > 0) {
            filteredReports = damagedReports.filter((report) =>
                emailAddresses.includes(report.OfficerId)
            );
            setTimelineDataStatus(true)
        }

        const data = filteredReports.reduce((acc, report) => {
            const existingData = acc.find((d) => d.date === report.date);
            if (existingData) {
                existingData.count++;
            } else {
                acc.push({ date: report.date, count: 1 });
            }
            return acc;
        }, []);

        setTimelineData(data);
    };
    /** Genrating chart to represent the recovered represented as per time/date*/
    const getRecoveredReports = async (emailAddresses) => {
        const querySnapshot = await getDocs(query(collection(db, "Damages"), where("Status", "==", "Recovered")));
        const damagedReports = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            date: doc.data().Details.toDate().toLocaleDateString(),
        }));

        let filteredReports = damagedReports;

        if (emailAddresses && emailAddresses.length > 0) {
            filteredReports = damagedReports.filter((report) =>
                emailAddresses.includes(report.OfficerId)
            );
            setTimelineDataStatus(true)
        }

        const data = filteredReports.reduce((acc, report) => {
            const existingData = acc.find((d) => d.date === report.date);
            if (existingData) {
                existingData.count++;
            } else {
                acc.push({ date: report.date, count: 1 });
            }
            return acc;
        }, []);

        setTimelineRecovered(data);
    };
    /** Details of recovered roads */
    const recovered = async () => {
        await getData();
        setRecoveredRoads(result.filter(damage => damage.Status === 'Recovered'));
    }
    /** Recovery by officer */
    const getRecoveryByOfficer = async (email) => {
        const q = query(DamagedCollectionRef, where("OfficerId", "==", email), where("Status", "==", "Recovered"));
        const data = await getDocs(q)
        const res = []
        data.forEach(element => {
            res.push(element.data())
        });
        setRecoveredByOfficer(res);
    }
    /** Filtering all data by date */
    const filterByDate = async (startDate, endDate, a) => {
        //console.log(startDate.toLocaleDateString())
        const newStartDate = Timestamp.fromDate(new Date(startDate));
        const newEndDate = Timestamp.fromDate(new Date(endDate));;

        const q = query(DamagedCollectionRef, where("Details", ">=", newStartDate), where("Details", "<=", newEndDate));
        try {
            const data = await getDocs(q);
            const res = [];
            data.forEach(element => {
                res.push(element.data());
            });
            if (a === 1) {
                setTimerelatedDataRecovered(res.filter(data => data.Status === "Recovered"))
            } else {
                setTimerelatedData(res);
            }
        } catch (error) {
            console.log(error);
        }
    }
    /** Ratio of selected officers */
    const analytics = async (label) => {
        await getData();
        const res = result.filter(data => data.OfficerId === label);
        const recov = res.filter(data => data.Status === "Recovered")
        const ratio = ((recov.length / res.length) * 100).toFixed(2);
        console.log(ratio)
    }
    /** complaint part */
    const submitComplaint = async () => {
        console.log("aja")
        try {
            await setDoc(complaintRef, {
                Email: email,
                Message: complaintData,
            })
            setComplaintStatus(true)
        } catch (error) {

        }
    }
    const handleClick = () => {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className="view">
            <div className="intro-container">
                <h1 className="intro-title">Welcome to RoadXamine</h1>
                <h2 className="intro-subtitle">View Damaged and Recovered Roads</h2>
                <p className="intro-paragraph">
                    Welcome to the RoadXMaine View Page, your ultimate resource for accessing detailed information on road damages and recoveries in Maine. This page provides a comprehensive overview of road conditions across the state, allowing you to search for specific details by district, name, state, or officer email. Our database is constantly updated, providing you with the latest and most accurate information on road damages and recoveries.
                    Our view page offers a range of functionalities to help you better understand the state of Maine's road infrastructure. You can access detailed information on all damaged and recovered roads, including the location, severity, and officer in charge of repairs. Additionally, you can view visual representations of damages, including pie charts detailing the damages by officer and timeline charts displaying damages by date.
                    Our search functionality is user-friendly and intuitive, allowing you to filter results by district, name, state, or officer email. You can also narrow your search by specifying a date range for the damages you are interested in. For officers, you can view detailed information on their repairs, including their ratio of damaged-to-recovered roads, as well as a timeline chart of all their damaged roads and a list of all the roads they have repaired.
                    Our goal is to provide you with the most comprehensive and up-to-date information on road conditions in Maine. We hope that our view page helps you better understand the state of our roads, and aids you in making informed decisions about your travel plans. Thank you for using RoadXMaine, and we look forward to providing you with a seamless user experience.
                </p>
                <button className="intro-button" onClick={handleClick}>Get Started</button>
            </div>
            <br />
            <div className="allDamages" ref={scrollRef}>
                <div className="matter" style={{ marginRight: "3vh" }}>
                    <h3>All Time Damages and Recoveries</h3>
                    <p>Displays a list of all the damaged and recovered roads of all time.</p>
                    <button onClick={async () => {
                        await getData();
                        setState(true);
                    }}>Get Data</button>
                </div>
                <div className="data" style={{ marginLeft: "3vh" }}>
                    {state === true ?
                        result.length === 0 ?
                            <p>No data found</p>
                            : <DisplayTable damages={result} isForRecoveredRoads={false} />
                        : null
                    }
                </div>
            </div>

            <div className="searchByName">
                <div className="data" style={{ marginRight: "3vh" }}>
                    {filteredData.length > 0 && (
                        <DisplayTable damages={filteredData} isForRecoveredRoads={false} />
                    )}
                </div>
                <div className="matter" style={{ marginLeft: "3vh" }}>
                    <h3>Search by district, name, state or email</h3>
                    <p>Enter a district, name, state, or email to get the details of damaged and recovered roads of all time of that particular input. Click the "Search" button to fetch and display the data.</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        getOfficerData(e.target.elements.division.value);
                    }}>
                        <label>Division/District/State:</label>
                        <input id="division" type="text" placeholder="L.B Nagar" />
                        <button type="submit">Get Data</button>
                    </form>
                </div>
            </div>

            <div className="damagesByOfficer">
                <div className="matter" style={{ marginRight: "3vh" }}>
                    <h3>Damages by Officer</h3>
                    <p> Displays a pie chart showing the damages of each officer. Click the "View Chart" button to display the chart.</p>
                    <button onClick={async () => {
                        await generateChartData();
                    }}>View Chart</button>
                </div>
                <div className="data" style={{ marginLeft: "3vh" }}>
                    {chartData.length > 0 && (
                        <PieChart width={500} height={500}>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                isAnimationActive={true}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    )}
                </div>
            </div>

            <div className="timelineAll">
                <div className="data" style={{ marginRight: "3vh" }}>
                    {timelineData.length > 0 && !timelineDataStatus ?
                        <DisplayChart data={timelineData} />
                        : null}
                </div>
                <div className="matter" style={{ marginLeft: "3vh" }}>
                    <h3>Timeline of all Damaged Roads</h3>
                    <p>Displays a timeline chart of damaged roads of all officers. Click the "View Timeline" button and enter the officer's email to fetch and display the data.</p>
                    <button onClick={async () => await getDamagedReports()}>
                        Get data
                    </button>
                </div>
            </div>

            <div className="timeLineByOfficer">
                <div className="matter" style={{ marginRight: "3vh" }}>
                    <h3>Timeline of Damaged Roads by Officer</h3>
                    <p>Enter the email of an officer to display the timeline chart of damaged roads of that particular officer. Click the "View Timeline" button to fetch and display the data.</p>
                    <p>Time line by officer</p>
                    <form onSubmit={(e) => { e.preventDefault(); getDamagedReports(e.target.elements.email.value) }}>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="data" style={{ marginLeft: "3vh" }}>
                    {timelineData.length > 0 && timelineDataStatus ?
                        <DisplayChart data={timelineData} />
                        : null}
                </div>
            </div>

            <div className="allRecovered" >
                <div className="data" style={{ marginRight: "3vh" }}>
                    {recoveredRoads.length > 0 && (
                        <div>
                            <h2>Recovered Roads</h2>
                            <DisplayTable damages={recoveredRoads} isForRecoveredRoads={true} />
                        </div>
                    )}
                </div>
                <div className="matter" style={{ marginLeft: "3vh" }}>
                    <h3>All recovered Roads</h3>
                    <p>Displays the details of all recovered roads. Click the "View Recovered Roads" button to fetch and display the data.</p>
                    <button onClick={recovered}>Recovered Roads</button>
                </div>
            </div>

            <div className="recoveryByOfficer">

                <div className="matter" style={{ marginRight: "3vh" }}>
                    <h3>Recovered Roads by Officer</h3>
                    <p>Enter the email of an officer to display the recovered roads of them. Click the "View Recovered Roads" button to fetch and display the data.</p>

                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        await getRecoveryByOfficer(e.target.elements.input.value)
                    }}>
                        <input type="email" name="input" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="data" style={{ marginLeft: "3vh" }}>
                    {recoveredByOfficer.length > 0 && (
                        <DisplayTable damages={recoveredByOfficer} isForRecoveredRoads={true} />
                    )}
                </div>
            </div>

            <div className="timelineRecovered">
                <div className="data" style={{ marginRight: "3vh" }}>
                    {timelineRecovered.length > 0 && !timelineDataStatus ?
                        <DisplayChart data={timelineRecovered} />
                        : null}
                </div>
                <div className="matter" style={{ marginLeft: "3vh" }}>
                    <h3>Timeline of Recovered Roads by Officer</h3>
                    <p>Displays a timeline chart of damaged roads of all officers. Click the "View Timeline" button and enter the officer's email to fetch and display the data.</p>
                    <button onClick={async () => await getRecoveredReports()}>
                        Get data
                    </button>
                </div>

            </div>


            <div className="allByDate">
                <div className="matter" style={{ marginRight: "3vh" }}>
                    <h3>Damaged Roads by Date</h3>
                    <p>Enter the starting and ending date to display the damaged roads of that particular date. Click the "Search" button to fetch and display the data.</p>
                    <label htmlFor="startDate">Start Date:</label>
                    <DatePicker id="startDate" name="startDate" selected={startDate} onChange={date => setStartDate(date)} />
                    <label htmlFor="endDate">End Date:</label>
                    <DatePicker id="endDate" name="endDate" selected={endDate} onChange={date => setEndDate(date)} />
                    <button onClick={() => filterByDate(startDate, endDate, 0)}>Filter By Date</button>
                </div>
                <div className="data" style={{ marginLeft: "3vh" }}>
                    {timerelatedData.length > 0 && (
                        <DisplayTable damages={timerelatedData} isForRecoveredRoads={false} />
                    )}
                </div>
            </div>

            <div className="recoveredByDate">
                <div className="data" style={{ marginRight: "3vh" }}>
                    {timerelatedData.length > 0 && (
                        <DisplayTable damages={timerelatedDataRecovered} isForRecoveredRoads={true} />
                    )}
                </div>
                <div className="matter" style={{ marginLeft: "3vh" }}>
                    <h3>Recovered Roads by Date</h3>
                    <p>Enter the starting and ending date to display the recovered roads of that particular date. Click the "Search" button to fetch and display the data.</p>
                    <label htmlFor="startDate">Start Date:</label>
                    <DatePicker id="startDate" name="startDate" selected={startDate} onChange={date => setStartDate(date)} />
                    <label htmlFor="endDate">End Date:</label>
                    <DatePicker id="endDate" name="endDate" selected={endDate} onChange={date => setEndDate(date)} />
                    <button onClick={() => filterByDate(startDate, endDate, 1)}>Search</button>
                </div>
            </div>

            <div className="ratio">
                <div className="matter" style={{ marginRight: "3vh" }}>
                    <h3>Damaged/Recovered Ratio by Officer</h3>
                    <p> Enter the email of an officer to display the damaged recovered ratio. Click the "View Ratio" button to fetch and display the data.</p>
                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        await analytics(labelData)
                    }}>
                        <input type="email" onChange={(e) => setLabelData(e.target.value)} />
                        <button type="submit">Some Analytics</button>
                    </form>
                </div>
                <div className="data" style={{ marginLeft: "3vh" }}>
                </div>

            </div>

            <div className="complaints">
                <div className="data">
                    {complaintStatus && (
                        <div className="response">
                            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngmart.com%2Ffiles%2F20%2FSuccess-PNG-Isolated-HD-Pictures.png&f=1&nofb=1&ipt=c94870ce660625a3e3d4a7be52a0397a8c0d49509b2ebfbc616b22419dd94dd3&ipo=images" alt="" srcset="" />
                        </div>
                    )}
                </div>
                <div className="matter">
                    <h3 style={{ color: "#ff004f" }}>Register a complaint</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        submitComplaint();
                    }}>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="" onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="text">Message</label>
                        <input type="text" onChange={(e) => setComplaintData(e.target.value)} id="text" />
                        <label htmlFor="image">Image</label>
                        <input type="file" name="file" id="" />
                        <button type="submit">Register a complaint</button>
                    </form>
                </div>

            </div>

        </div>
    )
}
export default View;

