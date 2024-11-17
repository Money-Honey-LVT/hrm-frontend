import { CreateUnitPayload } from '@/configs/api/payload';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import { UnitActions } from '@/redux/reducers/unit/unit.action';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';

interface Props {
  closeModal: () => void;
}

const ModalCreateUnit: React.FC<Props> = ({ closeModal }) => {
  const dispatch = useAppDispatch();
  const { units } = useAppSelector(
    (state: RootState) => state.unit
  );

  const form = useForm<CreateUnitPayload>({
    initialValues: {
      name: '',
      parentName: ''
    },
    validate: {
      name: isNotEmpty('Không được để trống'),
      parentName: isNotEmpty('Không được để trống')
    }
  });
  return (
    <form
      id="form-create-unit"
      onSubmit={form.onSubmit((values) => {
        dispatch(
          UnitActions.createUnit(values, {
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
          <Button type={'submit'}>Tạo</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ModalCreateUnit;
