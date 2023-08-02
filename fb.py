import firebase_admin
from firebase_admin import credentials, storage, firestore
import datetime


def connect(cameraId, Details, OfficerId, image):
    cred = credentials.Certificate(
        "crud-59e0c-firebase-adminsdk-mm553-0f516a9c6b.json")
    firebase_admin.initialize_app(
        cred, {'storageBucket': 'crud-59e0c.appspot.com'})
    bucket = storage.bucket()

    # Upload the image to Firebase Storage
    image_name = image  # generate a unique image name
    blob = bucket.blob(image_name)
    blob.upload_from_filename(image)

    # Get the download URL of the uploaded image
    image_url = blob.public_url

    # Get a Firestore client
    db = firestore.client()

    # Check if a document with the given cameraId already exists in the Damages collection
    query = db.collection('Damages').where('CameraId', '==', cameraId)
    docs = query.get()
    if len(docs) > 0:
        #print(f"A document with cameraId {cameraId} already exists.")
        return

    # Define the data to be uploaded
    data = {
        'CameraId': cameraId,
        'Details': Details,
        'OfficerId': OfficerId,
        'ImageUrl': image_url,
    }

    # Upload the data to a Firestore collection
    db.collection('Damages').add(data)
