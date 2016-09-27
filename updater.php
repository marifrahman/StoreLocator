<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 

if (isset($_POST['type']) && !empty($_POST['type'])) {
    $type = $_POST['type'];

    switch ($type) {
        case "save_contractor":
            save_contractor();
            break;
        case "delete_contractor":
            delete_contractor();
            break;
        default:
            invalidRequest();
    }
} else {
    invalidRequest();
}

function save_contractor() {

    try {
        $data = array();

        $index = isset($_POST["contractor"]['index']) ? $_POST["contractor"]['index'] : '';
        $name = isset($_POST["contractor"]['name']) ? $_POST["contractor"]['name'] : '';
        $address = isset($_POST["contractor"]['address']) ? $_POST["contractor"]['address'] : '';
        $postal = isset($_POST["contractor"]['postal']) ? $_POST["contractor"]['postal'] : '';
        $country = isset($_POST["contractor"]['country']) ? $_POST["contractor"]['country'] : '';
        $lat = isset($_POST["contractor"]['lat']) ? $_POST["contractor"]['lat'] : '';
        $lng = isset($_POST["contractor"]['lng']) ? $_POST["contractor"]['lng'] : '';

        $json = getLocationData();
        if (!empty($index)) {
            $json[$index]["name"] = $name;
            $json[$index]["address"] = $address;
            $json[$index]["postal"] = $postal;
            $json[$index]["country"] = $country;
            $json[$index]["lat"] = $lat;
            $json[$index]["lng"] = $lng;

            $data['message'] = 'Contractor Updated successfully !';
        } else {
            array_push($json, array(
                "name" => $name,
                "address" => $address,
                "postal" => $postal,
                "country" => $country,
                "lat" => $lat,
                "lng" => $lng
            ));

            $data['message'] = 'Contractor Added successfully !';
        }

        saveLocationData($json);

        $data['success'] = true;
        echo json_encode($data);
        exit;
    } catch (Exception $e) {
        $data = array();
        $data['success'] = false;
        $data['message'] = $e->getMessage();
        echo json_encode($data);
        exit;
    }
}

function delete_contractor() {

    try {
        $index = isset($_POST['index']) ? $_POST['index'] : '';

        if (!empty($index)) {
            $json = getLocationData();
            array_splice($json, $index,1);
            saveLocationData($json);
            $data['success'] = true;
            $data['message'] = 'Contractor deleted successfully.';
            echo json_encode($data);
            exit;
        } else {
            //throw new Exception();
        }
    } catch (Exception $e) {
        $data = array();
        $data['success'] = false;
        $data['message'] = $e->getMessage();
        echo json_encode($data);
        exit;
    }
}

function getLocationData()
{
    copy("data/locations.json", "backup/locations.json"."_".date("YmdHms"));
    return  json_decode(file_get_contents("data/locations.json"), true);
}
function saveLocationData($json)
{
    file_put_contents("data/locations.json", json_encode($json, TRUE));
}

function invalidRequest() {
    $data = array();
    $data['success'] = false;
    $data['message'] = "Invalid request.";
    echo json_encode($data);
    exit;
}
