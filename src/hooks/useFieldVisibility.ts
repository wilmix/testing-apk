import { useMemo } from 'react';
import { OrdenTrabajoFormData } from '../types/ordenTrabajo';

interface FieldVisibility {
  [field: string]: boolean;
}

/**
 * Hook para determinar qué campos deben mostrarse según reglas de visibilidad condicional
 * Regla principal: campo "agencia" visible solo si cliente = "BANCO SOLIDARIO S.A."
 * @param formData - Datos del formulario
 * @returns Object con visibilidad de cada campo
 */
export function useFieldVisibility(formData: OrdenTrabajoFormData): FieldVisibility {
  const visibility = useMemo((): FieldVisibility => {
    return {
      // Cliente siempre visible
      cliente: true,
      fechaEntrega: true,

      // Agencia visible solo si cliente es "BANCO SOLIDARIO S.A."
      agencia: formData.cliente === 'BANCO SOLIDARIO S.A.',

      // Dirección visible si cliente es "BANCO SOLIDARIO S.A." O si agencia NO está visible
      // (alternativa a agencia)
      direccion: formData.cliente !== 'BANCO SOLIDARIO S.A.',

      // Teléfono siempre visible
      telefono: true,

      // Número de orden siempre visible
      numeroOrden: true,

      // Detalles siempre visible
      detalles: true,

      // Observaciones siempre visible
      observaciones: true,

      // Préstamo siempre visible
      prestamoExtintores: true,

      // Cantidad de préstamo visible solo si prestamoExtintores = true
      cantidadPrestamo: formData.prestamoExtintores === true,

      // Documento siempre visible
      documento: true,

      // Email siempre visible
      email: true,
    };
  }, [formData.cliente, formData.prestamoExtintores]);

  return visibility;
}
