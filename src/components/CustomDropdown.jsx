import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { TextInput, Surface } from "react-native-paper";
import PropTypes from "prop-types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CustomDropdown = ({ label, placeholder, options, value, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const DropdownButton = useRef();

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onSelect(item.value);
        setVisible(false);
      }}
    >
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop }]}>
            <Surface style={styles.surface}>
              <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
              />
            </Surface>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity ref={DropdownButton} onPress={toggleDropdown}>
        <TextInput
          label={label}
          value={options.find((option) => option.value === value)?.label || ""}
          placeholder={placeholder}
          editable={false}
          right={<TextInput.Icon icon="menu-down" />}
        />
      </TouchableOpacity>
      {renderDropdown()}
    </View>
  );
};

CustomDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  overlay: {
    width: "100%",
    height: "100%",
  },
  dropdown: {
    position: "absolute",
    width: SCREEN_WIDTH - 32, // Ajusta este valor según sea necesario
    marginHorizontal: 16,
    backgroundColor: "transparent",
  },
  surface: {
    elevation: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default CustomDropdown;
