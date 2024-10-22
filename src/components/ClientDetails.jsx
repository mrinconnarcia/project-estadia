import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import clientService from "../services/clientService";
import PolicyList from "./PolicyListByClient";
import PaymentList from "./PaymentListByClient";
import EditClientModal from "./EditClientModal";
import { toast } from "react-toastify";
import { CircleUserRound, PlusCircle, X } from "lucide-react";

const ClientDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { state } = useLocation();

  const { clientDetails } = state || {};
  const [userId, setUserId] = useState(null);
  const { clientId } = useParams();

  const [client, setClient] = useState(clientDetails || null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []);

  const fetchClientData = useCallback(async () => {
    setLoading(true);
    try {
      const clientData = await clientService.getClientDetails(userId, clientId);
      setClient(clientData);

      const notesData = await clientService.getClientNotes(clientId);
      console.log("Fetched notes data:", notesData);
      console.log("Type of notesData:", typeof notesData);
      console.log("Is notesData an array?", Array.isArray(notesData));

      if (Array.isArray(notesData) && notesData.length > 0) {
        console.log("Setting notes:", notesData);
        setNotes(notesData);
      } else {
        console.warn("Notes data is empty or not an array:", notesData);
        setNotes([]);
      }
    } catch (error) {
      console.error("Error in fetchClientData:", error);
      toast.error("Error al cargar los datos del cliente");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [userId, clientId]);

  useEffect(() => {
    if (userId && clientId) {
      fetchClientData();
    }
  }, [userId, clientId, fetchClientData]);

  useEffect(() => {
    console.log("Notes state after update:", notes);
  }, [notes]);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        const response = await clientService.addClientNote(clientId, newNote);
        console.log("Add note response:", response);
        const newNoteFormatted = {
          id: response.noteId,
          contenido: newNote,
          created_at: new Date().toISOString(),
        };
        setNotes((prevNotes) => [newNoteFormatted, ...prevNotes]);
        setNewNote("");
        setIsAddingNote(false);
        toast.success("Nota agregada exitosamente");
      } catch (error) {
        console.error("Error adding note:", error);
        toast.error("Error al agregar la nota");
      }
    }
  };

  const handleUpdateClient = async (updatedClient) => {
    if (!userId || !clientId) {
      console.error("userId or clientId is undefined in handleUpdateClient");
      toast.error("Error: Datos de usuario o cliente no disponibles");
      return;
    }
  
    try {
      console.log('Updating client with data:', updatedClient);
      setClient(prevClient => ({ ...prevClient, ...updatedClient }));
      toast.success("Cliente actualizado exitosamente");
      setShowEditModal(false);
      await fetchClientData();
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Error al actualizar el cliente");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!client) return <NotFound message="No se encontró el cliente" />;

  // if (!client) {
  //   return (
  //     <div className="text-center py-10">
  //       No se encontraron datos del cliente.
  //     </div>
  //   );
  // }

  if (showPolicies) {
    return (
      <PolicyList
        clientId={clientId}
        clientName={client.nombre}
        onBack={() => setShowPolicies(false)}
      />
    );
  }

  if (showPayments) {
    return (
      <PaymentList
        clientId={clientId}
        clientName={client.nombre}
        onBack={() => setShowPayments(false)}
      />
    );
  }

  


  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mx-auto">
      <div className="flex justify-start items-center mb-6">
        <h1 className="text-2xl font-bold mr-4">DATOS DEL CLIENTE</h1>
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 mr-4 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300"
        >
          Editar Cliente
        </button>
      </div>

      <div className="flex items-start bg-gray-50 p-4 rounded-lg">
        <CircleUserRound className="w-24 h-24 rounded-full mr-6 border-4 border-white shadow-lg" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {client.nombre} {client.apellidos}
          </h2>
          <p className="text-gray-600">Edad: {client.edad} años</p>
          <p className="text-gray-600">
            Fecha de nacimiento:{" "}
            {new Date(client.fecha_nacimiento).toLocaleDateString()}
          </p>
          <p className="text-gray-600">Correo: {client.correo}</p>
          <p className="text-gray-600">Tel/cel: {client.telefono}</p>
          <p className="text-gray-600">
            Contacto de emergencia: {client.contacto_emergencia}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={() => setShowPolicies(true)}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
        >
          Ver Pólizas
        </button>
        {/* <button
          onClick={() => setShowPayments(true)}
          className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300"
        >
          Ver Pagos
        </button> */}
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">NOTAS</h3>
          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-300 flex items-center"
          >
            {isAddingNote ? (
              <>
                <X className="mr-2" size={18} />
                Cancelar
              </>
            ) : (
              <>
                <PlusCircle className="mr-2" size={18} />
                Agregar Nota
              </>
            )}
          </button>
        </div>
        
        {isAddingNote && (
          <div className="bg-gray-50 p-4 rounded-md mb-4 shadow-md transition-all duration-300 ease-in-out">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              placeholder="Escribe tu nota aquí..."
              rows={4}
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddNote}
                className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-300 flex items-center"
              >
                <PlusCircle className="mr-2" size={18} />
                Guardar Nota
              </button>
            </div>
          </div>
        )}
        
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay notas para este cliente.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 p-4 rounded-md shadow transition-all duration-300 ease-in-out hover:shadow-md"
              >
                <p className="text-gray-800">{note.contenido}</p>
                <p className="text-sm text-gray-500 text-right mt-2">
                  {formatDate(note.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditModal && (
        <EditClientModal
          client={client}
          userId={userId}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateClient}
        />
      )}
    </div>
  );
  function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  function ErrorMessage({ message }) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }
  
  function NotFound({ message }) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No encontrado</h2>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }
};

export default ClientDetails;