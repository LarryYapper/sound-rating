import os
import glob

# Set the target directory
target_directory = "C:/Users/filip/Desktop/Hlavni-slozka/Forvo-rating/public/sounds"

# Pattern to match files with "-A" or "-B" in their filenames
patterns = ["*-A*.mp3", "*-B*.mp3"]

# Find and delete files matching the patterns
for pattern in patterns:
    for filename in glob.glob(os.path.join(target_directory, pattern)):
        os.remove(filename)
        print(f"Deleted {filename}")