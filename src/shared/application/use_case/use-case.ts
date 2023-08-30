export interface ApplicationAction<Input, Output> {
  executeSignup?(input: Input): Output | Promise<Output>;
  findOne?(input: Input): Output | Promise<Output>;
  findAll?(input: Input): Promise<Output>;
  update?(input: Input): Promise<Output>;
  remove?(input: Input): Promise<Output>;
  executeSignIn?(input: Input): Promise<Output>;
}
