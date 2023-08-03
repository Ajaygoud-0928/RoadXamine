# RoadXamine

RoadXamine is an innovative project that aims to revolutionize road monitoring through the continuous use of ESP32 camera and Neo6M GPS modules, providing real-time updates to officers and users. This comprehensive solution incorporates a meticulously designed website, powered by React, offering advanced activity tracking and insightful analytics.

## Directory Structure

```
Main
├── client
│   ├── MyComponents
│   │   ├── HomePage.js
│   │   └── ... (Other components)
│   ├── App.css
│   ├── App.js
│   └── index.js
├── data
│   ├── images
│   │   └── ... (Image dataset)
│   └── labels
│       └── ... (Labels for the images)
├── crud-59e0c-firebase-adminsdk-mm553-0f516a9c6b.json
├── db.py
├── fb.py
├── main.py
└── yolov5(Cloned from GitHub link in below)
    └── trained_results(custom trained results)
```

## Project Overview

RoadXamine's primary goal is to provide real-time monitoring of roads using cutting-edge technologies. The project comprises the following key components:

1. **React-based Website**: A feature-rich website built with React, featuring MyComponents that include various essential elements, such as the homepage and more. The website serves as the central hub for users and officers to access road condition updates and analytics.

2. **Data Management**: The `data` folder houses the image dataset, which is utilized for road condition detection. The corresponding labels categorize the images into four classes: Damaged, Healthy, Vehicle, and Accident conditions.

3. **YOLOv5 Model**: The `yolov5` directory leverages the state-of-the-art YOLOv5 model for road condition detection. The model's training results are stored in the `trained_results` folder.

4. **Firebase Authentication**: The Firebase credentials in `crud-59e0c-firebase-adminsdk-mm553-0f516a9c6b.json` enable secure authentication for users and officers accessing the website.

5. **Database Management**: `fb.py` facilitates seamless storage of details about damaged roads in Firebase, capturing essential information such as timestamps, dates, officer details, region, state, and images.

## ESP32 Camera Module and Neo6M GPS Module

To accomplish the goal of continuous road monitoring, RoadXamine utilizes two crucial hardware components:

### ESP32 Camera Module

The ESP32 camera module plays a central role in capturing real-time images of roads. To use this module, you need to upload the provided Arduino code using the Arduino IDE. Once uploaded, the ESP32 camera module will be ready to capture images effectively.

### Neo6M GPS Module

For accurate GPS tracking, the Neo6M GPS module is employed. To use this module, you will also need to utilize the Arduino platform to track GPS location data. The module then communicates this valuable location information to the main Python code via TCP communication.

## Installation and Dependencies

### React Website Dependencies:

To ensure the proper functioning of the React-based website, make sure the following dependencies are installed:

```
"@testing-library/jest-dom": "^5.16.5",
"@testing-library/react": "^13.4.0",
"@testing-library/user-event": "^13.5.0",
"axios": "^1.3.4",
"chart.js": "^4.2.1",
"firebase": "^9.19.1",
"nth-check": "^2.1.1",
"react": "^18.2.0",
"react-datepicker": "^4.11.0",
"react-dom": "^18.2.0",
"react-icons": "^4.8.0",
"react-router-dom": "^6.10.0",
"react-scripts": "^5.0.1",
"react-spring": "^9.7.1",
"recharts": "^2.5.0",
"useref": "^1.4.4"
```

### Detection and Database Dependencies:

To ensure seamless road condition detection and database management, follow these steps:

1. Install the required PyTorch version:

```
pip install torch==1.8.1+cu111 torchvision==0.9.1+cu111 torchaudio===0.8.1 -f https://download.pytorch.org/whl/lts/1.8/torch_lts.html
```

2. Clone the YOLOv5 repository:

```
git clone https://github.com/ultralytics/yolov5
```

3. Install YOLOv5 dependencies:

```
cd yolov5 && pip install -r requirements.txt
```

4. Optionally, if you need labelImg for image labeling:

```
git clone https://github.com/tzutalin/labelImg
pip install pyqt5 lxml --upgrade
cd labelImg && pyrcc5 -o libs/resources.py resources.qrc
```

(Note: This step is only necessary if you not have labeled data for your dataset.)

## Usage

To integrate the ESP32 camera module and Neo6M GPS module with the `main.py` code, follow these clear instructions:

1. **ESP32 Camera Module Integration**: Upload the provided Arduino code for the ESP32 camera module using the Arduino IDE. Once successfully uploaded, the ESP32 camera module will be fully operational, capturing images of roads as required.

2. **Neo6M GPS Module Integration**: Utilize the Arduino platform to track GPS location data using the Neo6M GPS module. Establish a TCP communication channel to send this valuable location information to the main Python script (`main.py`).

3. **Road Condition Detection**: The YOLOv5 model, located in the `yolov5` directory, will perform road condition detection using the captured images from the ESP32 camera module. The model's trained results are stored in the `trained_results` folder.

4. **Real-time Updates**: The detected road conditions and GPS data are utilized to provide real-time updates to officers and users through the React-based website. The website's intuitive interface enables seamless access to critical road condition information and insightful analytics.

## Contributing

We welcome contributions from the community to enhance RoadXamine's capabilities further. To contribute, follow these guidelines:

- **Reporting Issues**: If you encounter any issues with the project, kindly report them using the issue tracker on our GitHub repository.

- **Pull Requests**: Submit pull requests for bug fixes, enhancements, or new features. We appreciate detailed explanations of the changes made.

- **Coding Standards**: Adhere to the coding standards specified in the project to maintain consistency and readability.

## License

********************

## Contact

For any inquiries, feedback, or support, feel free to get in touch with us at:

- Email: ajayg.bathini@gmail.com
- GitHub: https://github.com/ajaygoud-0928/RoadXamine

---

This comprehensive README includes all the necessary information about the RoadXamine project, from its components to hardware integration, dependencies, usage, and contribution guidelines. If you have any additional details or specific vocabulary you'd like to incorporate, please let me know, and I'll be happy to make further enhancements!
