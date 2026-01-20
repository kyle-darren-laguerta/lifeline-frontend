import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, Modal } from 'react-native';

export default function Dropdown({ options, placeHolder, onSelect, style }) {
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(placeHolder);

  // Sync state with prop updates
  useEffect(() => {
    setSelectedValue(placeHolder);
  }, [placeHolder]);

  return (
    <View style={[{ alignItems: "center", width: '100%' }, style]}>
      {/* The Input "Box" */}
      <Pressable
        onPress={() => setVisible(!visible)}
        style={[{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: '#382e2e',
          paddingHorizontal: 15,
          width: '90%',
          height: 45,
        }, style]}
      >
        <Text style={{ fontSize: 16, color: selectedValue === placeHolder ? '#999' : '#000' }}>
          {selectedValue}
        </Text>
        
        {/* Down Arrow Logo (Unicode character used for simplicity) */}
        <Text style={{ fontSize: 18, color: '#666' }}>▼</Text>
      </Pressable>

      {/* Simple Modal for Options List */}
      <Modal visible={visible} transparent animationType="fade">
        <Pressable 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setVisible(false)}
        >
          <View style={{ 
            width: '80%', 
            backgroundColor: '#fff', 
            borderRadius: 10, 
            padding: 10,
            elevation: 5 
          }}>
            {options.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setSelectedValue(item);
                  onSelect(item);
                  setVisible(false);
                }}
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  borderBottomWidth: index === options.length - 1 ? 0 : 0.5,
                  borderBottomColor: '#eee',
                }}
              >
                <Text style={{ fontSize: 16 }}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};