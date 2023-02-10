import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const TestWeatherScreen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://www.ncei.noaa.gov/cdo-web/api/v2/stations?extent=40.8559,-74.0735,40.9159,-74.0135', {
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