import * as yup from 'yup';

function createSchema(schema: (yupInstance: typeof yup) => yup.AnyObject) {
  return yup.object(schema(yup)).required();
}

export default createSchema;