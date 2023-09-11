<?php

$target_dir = "storage/uploads";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

// Check if the file exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
} else {
    // Move the file to the desired location
    move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file);
    echo "File uploaded successfully.";
?>
