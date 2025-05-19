from flask import Blueprint, request, jsonify
from templates.create_template import create_template
from templates.remove_template import remove_template_service
from templates.list_templates import list_templates
from templates.list_templates import list_templates
from templates.get_template import get_template

templates_bp = Blueprint("templates", __name__)

@templates_bp.route("/create_template", methods=["POST"])
def create_template_service():
    return create_template()

@templates_bp.route("/get_templates", methods=["GET"])
def list_templates_service():
    return list_templates()

@templates_bp.route("/get_template/<path:key>", methods=["GET"])
def get_template_service(key):
    return get_template(key)

@templates_bp.route("/remove_template/<path:key>", methods=["DELETE"])
def remove_template_route(key):
    return remove_template_service(key)

