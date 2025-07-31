export interface Category {
  id: string;
  icon: string;
  title: string;
  iconColor: string;
}

export const categories: Category[] = [
  { id: 'general', icon: 'mingcute:settings-3-line', title: 'Chung', iconColor: 'text-gray-500' },
  { id: 'features', icon: 'mingcute:function-line', title: 'Tính năng', iconColor: 'text-blue-500' },
  { id: 'interface', icon: 'mingcute:layout-line', title: 'Giao diện', iconColor: 'text-purple-500' },
];