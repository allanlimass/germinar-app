import * as auth from "./auth";
import * as organization from "./organization";
import * as secretariat from "./secretariat";
import * as treasury from "./treasury";

export const schema = {
  ...auth,
  ...organization,
  ...secretariat,
  ...treasury,
};
