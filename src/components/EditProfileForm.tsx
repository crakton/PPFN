import {View} from 'react-native';
import {
  genders,
  states,
  nokRelationship,
  bloodGroup,
  genotype,
  religion,
  eduction,
  marriageStatus,
} from '../constants/staticMenus';
import {DropdownComp, Input} from './widgets/Input';
import {LargeSubmitFormBtn} from './widgets/Buttons';

export default function EditProfileForm() {
  return (
    <View>
      {/* read more about this component here: https://www.npmjs.com/package/react-native-select-dropdown#renderDropdownIcon */}
      <DropdownComp
        label="Select Gender"
        data={genders}
        onSelect={item => console.log(item, 'Item selected')}
      />
      <Input placeholder="Mobile Number" />
      <Input placeholder="Address" />
      <Input placeholder="City" />
      <DropdownComp
        label="Select State"
        data={states}
        onSelect={item => console.log(item, 'Item selected')}
      />
      <Input placeholder="Next of Kin" />
      <DropdownComp
        label="Relationship with Next of Kin"
        data={nokRelationship}
        onSelect={item => console.log(item, 'Item selected')}
      />
      <DropdownComp
        label="Blood Group"
        data={bloodGroup}
        onSelect={item => console.log(item, 'Item selected')}
      />
      <DropdownComp
        label="Genotype"
        data={genotype}
        onSelect={item => console.log(item, 'Item selected')}
      />
      <DropdownComp
        label="Religion"
        data={religion}
        onSelect={item => console.log(item, 'Item selected')}
      />
      <DropdownComp
        label="Education"
        data={eduction}
        onSelect={item => console.log(item, 'Item selected')}
      />
      <DropdownComp
        label="Marital Status"
        data={marriageStatus}
        onSelect={item => console.log(item, 'Item selected')}
      />
      <View>
        <LargeSubmitFormBtn
          text="Update"
          onPress={() => console.log('Updated')}
        />
      </View>
    </View>
  );
}
