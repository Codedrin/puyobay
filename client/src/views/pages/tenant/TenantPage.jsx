import React from 'react';
import TenantNavbar from '../../../constants/TenantNabar';
import TenantHeader from '../../components/tenant/TenantHeader';
import Map from '../../components/tenant/Map';
import TenantFooter from '../../components/tenant/TenantFooter';
const TenantPage = () => {
  return (
    <div>
      {/* Tenant Navbar */}
      <TenantNavbar />
      
      {/* Tenant Header */}
      <TenantHeader />

      {/* Map Component */}
      <Map />

      {/* Tenant Footer */}
      <TenantFooter />
    </div>
  );
};

export default TenantPage;
