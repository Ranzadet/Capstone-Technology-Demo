import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const TestWeatherScreen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // function printNames(value) {
    //   if (value["name"].includes("Hack")) {
    //     console.log(value);
    //   }
    // }
    
    // fetch('https://www.ncei.noaa.gov/cdo-web/api/v2/stations?extent=40.8559,-74.0735,40.8559,-74.0735', {
    //     method: 'GET',
    //     headers: {
    //         token: 'nOAusqiwSpCeUaFDUlOtljxvxWeAxQdF',
    //     },
    // })
    //   .then(response => response.json())
    //   .then(json => {
    //     // for (let location in json["results"]) {
    //     //   if (location["name"].includes("Hack")) {
    //     //     console.log(location);
    //     //   }
    //     // }
    //     let i = 0;
    //     while (i < json["results"].length) {
    //       if (json["results"][i]["name"].includes("Hack")) {
    //         console.log(location);
    //       }
    //       i++;
    //     }
    //   })
    //   // .then(json => json["results"].forEach(printNames))
    
    fetch('https://www.ncei.noaa.gov/cdo-web/api/v2/stations?extent=40.8559,-74.0735,40.8559,-74.0735', {
        method: 'GET',
        headers: {
            token: 'nOAusqiwSpCeUaFDUlOtljxvxWeAxQdF',
        },
    })
      .then(response => response.json())
      .then(json => setData(json))
      .then(console.log(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      {data ? (
        <Text>{data.title}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}; 

export default TestWeatherScreen; 