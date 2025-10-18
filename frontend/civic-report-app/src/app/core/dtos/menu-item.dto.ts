export class MenuItemDto {
  title!: string;
  description!: string;
  icon!: string;
  route!: string;
  permission!: string;
  visible!: boolean;
  action?: () => void;
}
