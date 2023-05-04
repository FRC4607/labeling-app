# CIS Labeling App

A simple app for labeling images for use in training a neural network that detects FRC game items.

Make sure to bind `/app/imgs` to a directory containing the `.png` images you want labeled, and `/app/labels` to a directory where you would like the created labels to go.

Once the image is running, `cd /app` in the container and run `python create-image-rows.py`. You should also do this after adding more images.

The app's front end is hosted on port 80.