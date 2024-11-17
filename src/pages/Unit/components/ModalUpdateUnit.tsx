import { UpdateUnitPayload } from '@/configs/api/payload';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import { UnitActions } from '@/redux/reducers/unit/unit.action';
import { IUnit } from '@/types/models/IUnit';
import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';

interface Props {
  closeModal: () => void;
  department: IUnit | null;
}

const ModalUpdateUnit: React.FC<Props> = ({ closeModal, department }) => {
  const dispatch = useAppDispatch();
  const { units } = useAppSelector(
    (state: RootState) => state.unit
  );
  const form = useForm<UpdateUnitPayload>({
    initialValues: {
      name: department?.name || '',
      parentName: department?.parentName || '',
    },
    validate: {
      name: isNotEmpty('Không được để trống'),
      parentName: isNotEmpty('Không được để trống'),
    }
  });
  return (
    <form
      id="form-create-department"
      onSubmit={form.onSubmit((values) => {
        dispatch(
          UnitActions.updateUnit(values, department?.id, {
            onSuccess: () => {
              closeModal();
              dispatch(UnitActions.getAllUnit());
            }
          })
        );
      })}
    >
      <Stack>
        <TextInput
          withAsterisk
          label="Tên xã"
          placeholder="Nhập tên xã"
          {...form.getInputProps('name')}
        />
        <TextInput
          withAsterisk
          label="Tên huyện"
          placeholder="Nhập tên huyện"
          {...form.getInputProps('parentName')}
        />
        <Group position={'right'}>
          <Button type={'submit'}>Cập nhật</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ModalUpdateUnit;
