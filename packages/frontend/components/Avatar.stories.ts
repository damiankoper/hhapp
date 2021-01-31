import { Meta } from '@storybook/vue'
import { Sex } from '../store/session/user.model'
import Avatar from './Avatar.vue'
export default {
  title: 'Avatar',
  component: Avatar,
  argTypes: {
    color: { control: 'color' },
    size: { control: 'number' },

    sex: { control: { type: 'select', options: Object.values(Sex) } },
  },
} as Meta

const Template = (_args: any, { argTypes }: any) => {
  return {
    components: { Avatar },
    props: Object.keys(argTypes),
    template: `<Avatar :color="color" :size="size" :sex="sex"/>`,
  }
}
export const Default = Template.bind({}) as any
Default.args = {
  color: '#bada55',
  size: 48,
  sex: Sex.MALE,
}
