import { useEffect, useState } from 'react';

export default function useDepartamento() {
  const [departamento, setDepartamento] = useState(null);

  useEffect(() => {
    const dep = localStorage.getItem('departamentoSeleccionado');
    if (dep) setDepartamento(dep);
  }, []);

  return departamento;
}
