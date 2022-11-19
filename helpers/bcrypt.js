import * as bcrypt from "bcrypt";

export const hash = async (input) => {
  return bcrypt.hash(input, 10);
};

export const compare = async (input, hash) => {
  return bcrypt.compare(input, hash);
};
