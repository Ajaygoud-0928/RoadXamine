import mysql.connector

def connect(cameraId,now,image):
    conn = mysql.connector.connect(user='sql6586515', password='biDngryJPP',host='sql6.freesqldatabase.com',database='sql6586515')
    myCur = conn.cursor()

    with open(image,"rb") as File:
        BinaryData = File.read()
    insert_stmt = ("INSERT INTO Damages(id, info, image) VALUES (%s, %s, %s)")
    data = (cameraId, now, BinaryData)

    try:
        myCur.execute(insert_stmt,data)
        conn.commit()
    except:
        print("Jy")
        conn.rollback()
    conn.close()
