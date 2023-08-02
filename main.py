from email.message import EmailMessage
#from fb import*
import ssl
#import matplotlib
import torch
#from matplotlib import pyplot as plt
import numpy as np
import cv2
import smtplib
from datetime import datetime,timedelta

################### MailId details ###################
email_sender = 'ajayg.bathini@gmail.com'
email_password = 'nlterizmavzlzhtg'
email_reciver = '1602-20-737-310@vce.ac.in'

################### Mail details ######################
subject = 'Notice........'
body = "Dear Officer, Road is damaged in your concerned region please check it out"
em = EmailMessage()
em['From'] = email_sender
em['To'] = email_reciver
em['Subject'] = subject
em.set_content(body)
context = ssl.create_default_context()

################## date #####################
now = datetime.now()
tomorrow = now 
################## flags, camera,employee details ###########
flag = 0 
currFrame = 0
cameraId = '14789'



model = torch.hub.load('ultralytics/yolov5', 'custom',path='yolov5/runs/train/exp4/weights/last.pt', force_reload=True)
cap = cv2.VideoCapture('https://media.gettyimages.com/id/462861217/video/potholes-on-city-streets.mp4?s=mp4-640x640-gi&k=20&c=m29PAUsPSn-ggot2rXvFrkSeZQjufQQdY_pnlAW0qH8=')
while cap.isOpened():
    ret, frame = cap.read()
    now = datetime.now()
    # Make detections
    results = model(frame)
    cv2.imshow('YOLO', np.squeeze(results.render()))
    df = results.pandas().xyxy[0].value_counts('name').index.tolist()
    if (len(df) == 0):
        print()
    else:
        if ((df[0] == 'Damaged Road') and ((now > tomorrow) or (flag == 0))): 
            name = 'results/frame' + str(currFrame) + '.jpg' 
            cv2.imwrite(name,frame)
            currFrame+= 1
            with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
                smtp.login(email_sender, email_password)
                smtp.sendmail(email_sender, email_reciver, em.as_string())
            tomorrow = now + timedelta(1)
            flag = 1
            #connect(cameraId,now,"1602-20-737-086@vce.ac.in",name)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()






