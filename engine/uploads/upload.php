<?php
$target_dir = "/engine/uploads/upload.php";
$target_file = $target_dir . basename($_FILES["/engine/uploads/"]["file"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($/engine/uploads//engine/uploads/,uploads));

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
  $check = getimagesize($_FILES["/engine/uploads/"]["file"]);
  if($check !== false) {
    echo "File is an image - " . $check["mime"] . ".";
    $uploadOk = 1;
  } else {
    echo "File is not an image.";
    $uploadOk = 0;
  }
}

// Check if file already exists
if (file_exists($target_file)) {
  echo "Sorry, file already exists.";
  $uploadOk = 0;
}

// Check file size
if ($_FILES["fileToUpload"]["size"] > 1000000) {
  echo "Sorry, your file is too large.";
  $uploadOk = 0;
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" ) {
  echo "Sorry, only JPG, JPEG, PNG  files are allowed.";
  $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
  echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
  if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $/storage/uploads/)) {
    echo "The file ". htmlspecialchars( basename( $_FILES["fileToUpload"]["file"])). " has been uploaded.";
  } else {
    echo "Sorry, there was an error uploading your file.";
  }
}