<?php

$servername = "elliottcswbase.mysql.db";
$username = "elliottcswbase";
$password = "WebDatabase01";
$dbname = "elliottcswbase";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // prepare sql and bind parameters
    $prep = $conn->prepare(
        "SELECT food_id, food_name, food_short_description, food_long_description, food_image_url, food_allergy, food_price, categories.category_name 
    FROM `food_table`
    LEFT JOIN categories ON food_table.category_id=categories.category_id
    ORDER BY categories.category_id");
    $prep->execute();
    $resultsRaw = $prep->fetchAll();
    $results = array();
    foreach ($resultsRaw as $col) {
        array_push($results, array("name" => $col["food_name"],
            "food_id" => $col["food_id"],
            "category" => $col["category_name"],
            "desc_short" => $col["food_short_description"],
            "desc_long" => $col["food_long_description"],
            "url" => "images/" . $col["food_image_url"],
            "price" => "£" . number_format(($col["food_price"] / 100), 2),
            "allergy" => $col["food_allergy"]));
    }

    $conn = null;
    echo json_encode(array("error" => "", "data" => $results));
    exit();
} catch (PDOException $e) {
    $conn = null;
    echo json_encode(array("error" => $e->getMessage(), "data" => ""));
    exit();
} catch (exception $e) {
    $conn = null;
    echo json_encode(array("error" => $e->getMessage(), "data" => ""));
    exit();
}
?>