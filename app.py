from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-secret-key'  # cambia en producción
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///microadmin.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

PROCESSING_TYPES = ["Filtro", "Agregacion", "Analisis", "Otro"]

class Microservice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    code = db.Column(db.String(60), unique=True, nullable=False)
    processing_type = db.Column(db.String(20), nullable=False, default="Otro")
    base_path = db.Column(db.String(120))
    sample_params_json = db.Column(db.Text)
    roble_token = db.Column(db.String(300))
    enabled = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    def __repr__(self):
        return f"<Microservice {self.code}>"

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return redirect(url_for("list_microservices"))

@app.route("/microservices")
def list_microservices():
    q = request.args.get("q", "").strip()
    query = Microservice.query
    if q:
        like = f"%{q}%"
        query = query.filter(
            db.or_(
                Microservice.name.ilike(like),
                Microservice.code.ilike(like),
                Microservice.processing_type.ilike(like),
            )
        )
    items = query.order_by(Microservice.created_at.desc()).all()
    return render_template("microservices/index.html", items=items, q=q)

@app.route("/microservices/create", methods=["GET", "POST"])
def create_microservice():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        code = request.form.get("code", "").strip()
        processing_type = request.form.get("processing_type", "Otro")
        base_path = request.form.get("base_path", "").strip()
        sample_params_json = request.form.get("sample_params_json", "").strip()
        roble_token = request.form.get("roble_token", "").strip()
        enabled = bool(request.form.get("enabled"))

        # Validaciones básicas
        if not name or not code:
            flash("Name y Code son obligatorios.", "danger")
            return render_template("microservices/form.html", item=None, processing_types=PROCESSING_TYPES)

        if processing_type not in PROCESSING_TYPES:
            flash("Processing Type inválido.", "danger")
            return render_template("microservices/form.html", item=None, processing_types=PROCESSING_TYPES)

        if sample_params_json:
            try:
                json.loads(sample_params_json)
            except Exception:
                flash("SampleParamsJson debe ser JSON válido.", "danger")
                return render_template("microservices/form.html", item=None, processing_types=PROCESSING_TYPES)

        # unicidad de code
        if Microservice.query.filter_by(code=code).first():
            flash("Ya existe un microservicio con ese Code.", "danger")
            return render_template("microservices/form.html", item=None, processing_types=PROCESSING_TYPES)

        item = Microservice(
            name=name,
            code=code,
            processing_type=processing_type,
            base_path=base_path or None,
            sample_params_json=sample_params_json or None,
            roble_token=roble_token or None,
            enabled=enabled
        )
        db.session.add(item)
        db.session.commit()
        flash("Microservicio creado.", "success")
        return redirect(url_for("list_microservices"))

    return render_template("microservices/form.html", item=None, processing_types=PROCESSING_TYPES)

@app.route("/microservices/<int:item_id>/edit", methods=["GET", "POST"])
def edit_microservice(item_id):
    item = Microservice.query.get_or_404(item_id)

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        code = request.form.get("code", "").strip()
        processing_type = request.form.get("processing_type", "Otro")
        base_path = request.form.get("base_path", "").strip()
        sample_params_json = request.form.get("sample_params_json", "").strip()
        roble_token = request.form.get("roble_token", "").strip()
        enabled = bool(request.form.get("enabled"))

        if not name or not code:
            flash("Name y Code son obligatorios.", "danger")
            return render_template("microservices/form.html", item=item, processing_types=PROCESSING_TYPES)

        if processing_type not in PROCESSING_TYPES:
            flash("Processing Type inválido.", "danger")
            return render_template("microservices/form.html", item=item, processing_types=PROCESSING_TYPES)

        if sample_params_json:
            try:
                json.loads(sample_params_json)
            except Exception:
                flash("SampleParamsJson debe ser JSON válido.", "danger")
                return render_template("microservices/form.html", item=item, processing_types=PROCESSING_TYPES)

        # verificar unicidad de code si cambió
        exists = Microservice.query.filter(Microservice.code == code, Microservice.id != item.id).first()
        if exists:
            flash("Ya existe otro microservicio con ese Code.", "danger")
            return render_template("microservices/form.html", item=item, processing_types=PROCESSING_TYPES)

        item.name = name
        item.code = code
        item.processing_type = processing_type
        item.base_path = base_path or None
        item.sample_params_json = sample_params_json or None
        item.roble_token = roble_token or None
        item.enabled = enabled
        item.updated_at = datetime.utcnow()

        db.session.commit()
        flash("Microservicio actualizado.", "success")
        return redirect(url_for("list_microservices"))

    return render_template("microservices/form.html", item=item, processing_types=PROCESSING_TYPES)

@app.route("/microservices/<int:item_id>/delete", methods=["GET", "POST"])
def delete_microservice(item_id):
    item = Microservice.query.get_or_404(item_id)
    if request.method == "POST":
        db.session.delete(item)
        db.session.commit()
        flash("Microservicio eliminado.", "success")
        return redirect(url_for("list_microservices"))
    return render_template("microservices/confirm_delete.html", item=item)

if __name__ == "__main__":
    # Permitir host local
    app.run(debug=True)
