import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios';

export default function App() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageObj, setImageObj] = useState();

  let openImagePickerAsync = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to camara roll is required");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    // console.log(pickerResult)

    if (pickerResult.canceled === true) {
      return;
    }

    console.log(pickerResult)

    setSelectedImage(pickerResult.assets[0].uri);
    setImageObj(pickerResult)
  };

  const handleUpload = async (image) => {

    let newfile = {
      uri: image.assets[0].uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    }

    const formData = new FormData();
    //formData.append('image', image);
    //formData.append('supervisor', "Cali");
    //formData.append('EPPs', "Casquito");
    //formData.append('areaName', "Mi casita");

    formData.append('file', newfile);
    formData.append('upload_preset', 'incidenteSubido');
    formData.append('cloud_name', 'dyaswn2t2');
    formData.append('folder', 'HarkAI-Incidentes');

    fetch('https://api.cloudinary.com/v1_1/dyaswn2t2/image/upload', {
      method: "post",
      body: formData,
    })
    .then(res => res.json())
    .then(formData => {
      console.log(formData.url);
      serverUpload(formData.url);
    })
    .catch(error => {
      console.log(error);
    });
    console.log("/////////////////")
  }

  const serverUpload = async (url) => {
    const jsonData = {
      supervisor: 'Calizaya',
      EPPs: 'Botas',
      areaName: 'Mi casa',
      imageUrl: `${url}`
    };

    try {
      const response = await fetch('https://hnxf8lcp-3000.brs.devtunnels.ms/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
      } else {
        console.error('Error en la solicitud de respuesta:', response.status);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hola :D
      </Text>
      <Image
        source={{uri: selectedImage !== null ? selectedImage : 'https://www.regmurcia.com/servlet/integra.servlets.Imagenes?METHOD=VERIMAGEN_101949&nombre=Pato_de_granja_Pato_res_720.jpg',
      }}
        style={styles.image}
      />
      <Button
        color="#000"
        title="Seleccionar imagen"
        onPress={openImagePickerAsync}/>
      <Button
        color="#000"
        title="Subir imagen a la nube"
        onPress={() => handleUpload(imageObj)}/>
      <StatusBar style="auto" />
    </View>
  );
  }



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff'
  },
  image: {
    height: 180,
    width: 180,
    borderRadius: 90
  }
  });
