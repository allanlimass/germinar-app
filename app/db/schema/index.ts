import * as auth from "./auth";
import * as organization from "./organization";
import * as finance from "./finance";
import * as people from "./people";

export const schema = {
  ...auth,
  ...organization,
  ...people,
  ...finance,
};
