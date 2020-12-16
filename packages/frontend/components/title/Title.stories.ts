import Title from '@/components/Title.vue'
export default {
  title: 'Title',
  component: Title,
}

const Template = (_args: any, { argTypes }: any) => {
  return {
    components: { Title },
    props: Object.keys(argTypes),
    template: `<Title :subtitle="subtitle" :size="size"/>`,
  }
}
export const Default = Template.bind({}) as any
Default.args = {
  subtitle: 'app',
}
