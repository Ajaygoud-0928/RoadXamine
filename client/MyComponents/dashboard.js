import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "./config/firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import 'firebase/storage';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

import './dashboard.css'
function Dashboard() {
    const navigate = useNavigate()
    const DamagedCollectionRef = collection(db, 'Damages');
    const OfficerCollectionRef = collection(db, 'Officer');
    const ComplaintCollectionRef = collection(db, 'Complaints');

    const { officerName } = useParams();
    const [result, setResult] = useState([]);
    const [state, setState] = useState(false);
    const [resLength, setResultLength] = useState(false);
    const [officerDetails, setOfficerDetails] = useState([]);
    const [recovered, setRecovered] = useState([]);
    const [damaged, setDamaged] = useState([])
    const [complaints, setComplaints] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [cameraId, setCameraId] = useState("");
    const [newStatus, setNewStatus] = useState("");
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/login');
            }
        });
        return unsubscribe;
    });

    useEffect(() => {
        async function getOfficerData() {
            try {
                const q = query(OfficerCollectionRef, where("Email", "==", auth.currentUser.email))
                const data = await getDocs(q);
                const res = data.docs[0].data()
                setOfficerDetails(res);
                const q1 = query(DamagedCollectionRef, where('OfficerId', '==', auth.currentUser.email));

                const dataw = await getDocs(q1);
                const res2 = [];
                dataw.forEach((doc) => {
                    res2.push(doc.data());
                });
                setRecovered(res2.filter((data) => data.Status === 'Recovered'))
                setDamaged(res2.filter((data) => data.Status === 'Damaged'))
            }
            catch{}
        }
            getOfficerData()
    }, [])

    const logout = async () => {
        await signOut(auth);
        navigate('/login');
    }

    const getData = async (a) => {
        const q = query(DamagedCollectionRef, where('OfficerId', '==', auth.currentUser.email));
        try {
            const data = await getDocs(q);
            const res = [];
            data.forEach((doc) => {
                res.push(doc.data());
            });
            setResult(res);
            if (res.length < 1) {
                setResultLength(true);
                return;
            }
            if (a !== 0)
                setState(true);
        } catch (error) {
            console.log(error);
        }
    }

    const getComplaints = async () => {
        try {
            const q = query(ComplaintCollectionRef, where("Email", "==", auth.currentUser.email))
            const data = await getDocs(q);
            const res = []
            data.forEach(element => {
                res.push(element.data())
            });
            setComplaints(res)
        }
        catch { }
    }

    const getChart = async () => {
        const meQuery = query(DamagedCollectionRef, where("OfficerId", "==", auth.currentUser.email));
        const meData = await getDocs(meQuery);
        const meCount = meData.size;

        const othersQuery = query(DamagedCollectionRef, where("OfficerId", "!=", auth.currentUser.email));
        const othersData = await getDocs(othersQuery);
        const othersCount = othersData.size;

        setChartData([
            { name: 'Me', value: meCount },
            { name: 'Others', value: othersCount },
        ]);
    }

    async function update() {
        try {
            const camerasCollectionRef = collection(db, "Damages");
            const camerasQuery = query(camerasCollectionRef, where("CameraId", "==", cameraId));
            const camerasSnapshot = await getDocs(camerasQuery);

            if (camerasSnapshot.empty) {
                console.error("No cameras found with matching CameraId");
                return;
            }

            camerasSnapshot.forEach(async (cameraDoc) => {
                await updateDoc(cameraDoc.ref, { Status: newStatus });
                console.log("Camera document updated successfully!");
            });
        } catch (error) {

        }
    }
    return (
        <div className="dashboard">
            <div className="profile-card">
                <div className="image">
                    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthelonelypetunia.files.wordpress.com%2F2014%2F12%2Fman-in-office.jpg&f=1&nofb=1&ipt=92bce62003441b142fcbf76e4ffe5cd6fe87101ae399cffced8c6f21263bf5e0&ipo=images" alt="" />
                </div>
                <div id="content">
                    <h1>Name: {officerDetails.Name}</h1>
                    <h3>Email: {officerDetails.Email}</h3>
                    <h3>District: {officerDetails.District}</h3>
                    <h3>Division: {officerDetails.Division}</h3>
                    <h3>State: {officerDetails.State}</h3>
                    <h3>No of Damaged: {damaged.length}</h3>
                    <h3>No of Recovered: {recovered.length}</h3>
                    <h3>Damaged Recovered Ratio: {(recovered.length / result.length) * 100}</h3>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
            <h1>Hello ,{officerName}</h1>

            <div className="lll">
                <div className="data">
                    <button className="bon" onClick={() => getData(1)}>Get Data</button>
                    {state ?
                        <table>
                            <thead>
                                <tr>
                                    <th>CameraId</th>
                                    <th>Details</th>
                                    <th>Officer Name</th>
                                    <th>Image</th>
                                    <th>Condition</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.CameraId}</td>
                                        <td>{new Date(data.Details.seconds * 1000).toLocaleString()}</td>
                                        <td>{officerName}</td>
                                        <td><button onClick={() => window.open(data.ImageUrl)}>Open Image</button></td>
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
                        : null
                    }
                    {resLength ?
                        <p>Well done no road damages at present</p>
                        : null
                    }
                </div>
                <div className="chart">
                    <button onClick={getChart}>Chart Data</button>
                    {chartData.length > 0 && (
                        <BarChart width={500} height={400} data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    )}
                </div>
            </div>


            <div className="kkk">
                <div className="v_complaint">
                    <h3>Click on the below button to view complaints</h3>
                    <button onClick={getComplaints}>View Complaints</button>
                    <div className="res">
                        {complaints.length > 0 && (
                            <>
                                {complaints.map((item, index) => (
                                    <div key={index}>
                                        <p>{item.Message}</p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                <div className="updatations">
                    <h3>Enter the camera Id and new status to update the details of damaged roads</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        update()
                    }}>
                        <label>Camera Id</label>
                        <input type="text" onChange={(e) => setCameraId(e.target.value)} />
                        <label>New Status</label>
                        <input type="text" onChange={(e) => setNewStatus(e.target.value)} />
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>







        </div>
    );
}
export default Dashboard;