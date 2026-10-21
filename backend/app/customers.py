from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_session
from app.models import Customer

router = APIRouter(prefix="/api/v1/customers", tags=["customers"])
SessionDependency = Annotated[Session, Depends(get_session)]


class CustomerCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=200)
    email: str | None = Field(default=None, max_length=320)
    phone: str | None = Field(default=None, max_length=40)
    notes: str | None = None


class CustomerUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=200)
    email: str | None = Field(default=None, max_length=320)
    phone: str | None = Field(default=None, max_length=40)
    notes: str | None = None


class CustomerRead(CustomerCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


def _get_customer(session: Session, customer_id: int) -> Customer:
    customer = session.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.get("", response_model=list[CustomerRead])
def list_customers(
    session: SessionDependency,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
):
    return list(
        session.scalars(select(Customer).order_by(Customer.id).offset(offset).limit(limit)).all()
    )


@router.post("", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, session: SessionDependency):
    customer = Customer(**payload.model_dump())
    session.add(customer)
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise HTTPException(status_code=409, detail="Customer email already exists") from exc
    session.refresh(customer)
    return customer


@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(customer_id: int, session: SessionDependency):
    return _get_customer(session, customer_id)


@router.patch("/{customer_id}", response_model=CustomerRead)
def update_customer(customer_id: int, payload: CustomerUpdate, session: SessionDependency):
    customer = _get_customer(session, customer_id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(customer, key, value)
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise HTTPException(status_code=409, detail="Customer email already exists") from exc
    session.refresh(customer)
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, session: SessionDependency):
    customer = _get_customer(session, customer_id)
    session.delete(customer)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
