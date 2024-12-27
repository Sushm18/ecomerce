import React from 'react'
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSidebar";
import DashboardHero from "../../components/Shop/DashboardHero";

const ShopDashboardPage = () => {

  return (
    <div>

      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-[330px] sticky top-0 left-0 800px:w-[330px]">
          <DashboardSidebar active={1} />
        </div>

        <DashboardHero />
      </div>

    </div>
  )
}

export default ShopDashboardPage 