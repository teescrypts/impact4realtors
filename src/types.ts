interface actionStateOk {
  ok: boolean;
  message: string;
}
interface actionStateErr {
  error: string;
}

export type ActionStateType = actionStateOk | actionStateErr | null;
