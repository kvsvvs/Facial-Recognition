import dlib
import numpy as np
from skimage import io

# Load the models
predictor_path = "./shape_predictor_68_face_landmarks.dat"
face_rec_model_path = "./dlib_face_recognition_resnet_model_v1.dat"
detector = dlib.get_frontal_face_detector()
sp = dlib.shape_predictor(predictor_path)
facerec = dlib.face_recognition_model_v1(face_rec_model_path)

# Load the images
img1 = io.imread("./sample_files/SampleImg3.jpeg")
img2 = io.imread("./sample_files/Ria.jpg")

# Detect faces
dets1 = detector(img1, 1)
dets2 = detector(img2, 1)

print("Number of faces detected in image 1: {}".format(len(dets1)))
print("Number of faces detected in image 2: {}".format(len(dets2)))

# Now process each face we found.
for k, d in enumerate(dets1):
    shape = sp(img1, d)
    face_descriptor1 = facerec.compute_face_descriptor(img1, shape)

for k, d in enumerate(dets2):
    shape = sp(img2, d)
    face_descriptor2 = facerec.compute_face_descriptor(img2, shape)

# Compare faces
a = np.array(face_descriptor1)
b = np.array(face_descriptor2)
dist = np.linalg.norm(a - b)
print("Euclidean distance between face descriptors: {}".format(dist))

# You can adjust the threshold value according to your observation from different pairs of images.
if dist < 0.6:
    print("It's the same person.")
else:
    print("It's not the same person.")
