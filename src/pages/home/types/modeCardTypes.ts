export interface ModeCardTypes {
  mode_id: number;
  name: string;
  icon: string;
  is_active: boolean;
}

export interface GetModesResponseTypes {
  modes: ModeCardTypes[];
}
