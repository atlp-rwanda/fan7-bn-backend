import Response from '../utils/response';
import UserSchema from '../modules/userSchema';
import validator from '../utils/validator';
import AuthUtils from '../utils/auth.utils';

const { trimmer } = validator;
/**
 * @description AuthMiddleware class handles user data validation
*/
class AuthMiddleware {
  /**
   * @param {req} req object
   * @param {res} res object
   * @param {next} next forwards request to the next middleware function
   * @returns {obj} returns a response object
  */
  static async signup(req, res, next) {
    const userData = trimmer(req.body);
    const { error } = UserSchema.signup(userData);
    try {
      const isEmailExists = await AuthUtils.emailExists(req.body);

      if (isEmailExists) {
        const response = new Response(res, 409, 'Email already used');
        return response.sendErrorMessage();
      }

      if (error) {
        const response = new Response(res, 422, error.message);
        return response.sendErrorMessage();
      }

      return next();
    } catch (err) {
      const response = new Response(res, 500, err);
      return response.sendErrorMessage();
    }
  }

  /**
   * @description This helps validate new role info
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @param  {object} next - forwards request to the next middleware function
   * @returns  {object} The response object
   */
  static async userRole(req, res, next) {
    const { id } = req.token;
    const { email, role } = req.body;
    const user = { email, role };
    const { error, value } = UserSchema.assignRole(user);

    if (error) {
      const response = new Response(res, 422, error.details[0].message);
      response.sendErrorMessage();
    } else {
      const superAdmin = await AuthUtils.superAdminExists(id);

      if (!superAdmin) {
        const response = new Response(res, 401, 'Your credintials are invalid');
        return response.sendErrorMessage();
      }
      if (superAdmin.role !== 'super-administrator') {
        const response = new Response(
          res,
          405,
          'You have no rights over this endpoint'
        );
        response.sendErrorMessage();
      }
      req.value = value;
      next();
    }
  }
}

export default AuthMiddleware;