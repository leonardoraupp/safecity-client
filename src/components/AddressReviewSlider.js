import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Slider, Icon } from '@rneui/themed';

const AddressReviewSlider = ({ onSliderValueChange }) => {
  const [value, setValue] = useState(0);
  const [vertValue, setVertValue] = useState(0);

  // function that will handle the value change of the Slider and pass it as a prop from the parent component.
  const handleSliderValueChange = (newValue) => {
    setValue(newValue);
    onSliderValueChange(newValue); // Pass the new value to the parent component
  };

  const interpolate = (start, end) => {
    let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const color = () => {
    let r = interpolate(255, 0);
    let g = interpolate(0, 255);
    let b = interpolate(0, 0);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <>
      <View style={styles.contentView}>
        <Text style={styles.text}>Deslize para avaliar</Text>
        <Slider
          value={value}
          onValueChange={handleSliderValueChange}
          maximumValue={10}
          minimumValue={0}
          step={1}
          allowTouchTrack
          trackStyle={{ height: 5, backgroundColor: 'transparent' }}
          thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
          thumbProps={{
            children: (
              <Icon
                name="heart-outline"
                type='ionicon'
                size={18}
                reverse
                containerStyle={{ bottom: 20, right: 20 }}
                color={color()}
              />
            ),
          }}
        />
        <Text style={{
          paddingTop: 20, color: 'black',
          fontWeight: 'bold',
          padding: 10,
          fontSize: 15
        }}>Nota: {value}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentView: {
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  verticalContent: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    height: 500,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  subHeader: {
    // backgroundColor: "#2089dc",
    color: "gray",
    textAlign: "center",
    paddingVertical: 5,
    marginBottom: 10
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    padding: 7,
    fontSize: 15
  }
});

export default AddressReviewSlider;