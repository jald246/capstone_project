import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { CiBookmark } from "react-icons/ci";
import { FiExternalLink, FiPlus, FiMinus } from "react-icons/fi";

export default function TableRowItem({ item, handleUpdateQuantity, toggleStockStatus }) {
  return (
    <tr style={{ opacity: item.inStock ? 1 : 0.65, transition: 'opacity 0.2s' }}>
      <td style={{ paddingLeft: '20px' }}>
        <Link to={`/${item.id}`} className="d-block" style={{ width: '60px' }}>
          <div 
            className="bg-light d-flex align-items-center justify-content-center border rounded overflow-hidden" 
            style={{ 
              width: '60px', 
              height: '60px',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              cursor: 'pointer' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = '#ff69b4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = '#dee2e6';
            }}
          >
            {item.photoURL ? (
              <img src={item.photoURL} alt={item.item} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '1.5rem' }}>📦</span>
            )}
          </div>
        </Link>
      </td>

      <td>
        <Link 
          to={`/${item.id}`} 
          className="text-decoration-none d-inline-block"
          style={{ color: 'inherit' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ff69b4';
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'inherit';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          <h6 className="mb-1 fw-bold text-dark text-capitalize" style={{ cursor: 'pointer', margin: 0 }}>
            {item.item || "Untitled Item"}
          </h6>
        </Link>
        <div className="mt-1">
          <span className="badge rounded-pill" style={{ backgroundColor: '#fff0f5', color: '#ff69b4', fontWeight: '500' }}>
            {item.type || "No Category"}
          </span>
        </div>
      </td>

      <td>
        {item.brand ? (
          <div className="d-flex align-items-center gap-1 text-secondary text-capitalize" style={{ fontSize: '0.95rem' }}>
            <CiBookmark style={{ color: '#ff69b4' }} />
            <span>{item.brand}</span>
          </div>
        ) : (
          <span className="text-muted small text-italic">N/A</span>
        )}
      </td>

      <td className="text-center">
        <div className="d-inline-flex align-items-center justify-content-center border rounded-pill bg-white p-1" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <Button variant="link" className="p-1 text-secondary d-flex align-items-center" onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} style={{ border: 'none', background: 'none' }}><FiMinus size={14} /></Button>
          <span className="px-2 fw-bold text-dark" style={{ minWidth: '30px', fontSize: '0.95rem' }}>{item.quantity}</span>
          <Button variant="link" className="p-1 text-secondary d-flex align-items-center" onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} style={{ border: 'none', background: 'none' }}><FiPlus size={14} /></Button>
        </div>
      </td>

      <td className="text-center">
        {item.supplierURL ? (
          <a href={item.supplierURL} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success rounded-pill px-3 d-inline-flex align-items-center gap-2">
            <span>Visit Supplier</span> <FiExternalLink size={14} />
          </a>
        ) : (
          <span className="text-muted small">None linked</span>
        )}
      </td>

    </tr>
  );
}
