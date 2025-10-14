from flask import jsonify

class APIError(Exception):
    status_code = 400
    def __init__(self, message, status_code=None, detail=None):
        super().__init__(message)
        if status_code is not None:
            self.status_code = status_code
        self.detail = detail

    def to_dict(self):
        data = {"message": str(self)}
        if self.detail:
            data["detail"] = self.detail
        return {"error": data}

def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(e):
        resp = jsonify(e.to_dict())
        resp.status_code = e.status_code
        return resp

    @app.errorhandler(401)
    def handle_unauthorized(e):
        return jsonify({"error": {"message": "Unauthorized"}}), 401

    @app.errorhandler(403)
    def handle_forbidden(e):
        return jsonify({"error": {"message": "Forbidden"}}), 403

    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({"error": {"message": "Not Found"}}), 404

    @app.errorhandler(Exception)
    def handle_exception(e):
        return jsonify({"error": {"message": "Internal Server Error"}}), 500
