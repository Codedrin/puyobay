import React from 'react';
import TenantNavbar from '../../../constants/TenantNabar'; 
import MapComponent from '../../components/tenant/MapComponent'; 
import TenantFooterProperty from '../../components/tenant/TenantFooterProperty';

const Properties = () => {
  return (
    <div>
      {/* Render the TenantNavbar */}
      <TenantNavbar />

      <div className="p-4 md:p-8">
        {/* Include the MapComponent here */}
        <div className="mt-8">
          <MapComponent />
        </div>
      </div>

      {/* Include the TenantFooter here */}
      <TenantFooterProperty />
    </div>
  );
};

export default Properties;
