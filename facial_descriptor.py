import dlib
import numpy as np
from skimage import io

# Load the models
predictor_path = "./shape_predictor_68_face_landmarks.dat"
face_rec_model_path = "./dlib_face_recognition_resnet_model_v1.dat"
detector = dlib.get_frontal_face_detector()
sp = dlib.shape_predictor(predictor_path)
facerec = dlib.face_recognition_model_v1(face_rec_model_path)

# Function to load and process an image
def process_image(image_path):
    # Load the image
    img = io.imread(image_path)
    
    # Detect faces
    dets = detector(img, 1)
    print(f"Number of faces detected in {image_path}: {len(dets)}")
    
    # Process each face found
    for k, d in enumerate(dets):
        # Get the landmarks/predictor for this face
        shape = sp(img, d)
        # Get the face descriptor
        face_descriptor = facerec.compute_face_descriptor(img, shape)
        # Convert the descriptor to a numpy array and log it
        face_descriptor_np = np.array(face_descriptor)
        print(f"Face {k+1} descriptor for {image_path}: {face_descriptor_np}")

# Specify your image paths
image_paths = ["./sample_files/SampleImg3.jpeg", "./sample_files/Ria.jpg"]

# Process each image
for path in image_paths:
    process_image(path)
