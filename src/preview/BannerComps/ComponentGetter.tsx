import React, { useEffect, useState } from "react";
import LoyaltyBanner from "./LoyaltyBanner";
import { CouponBanner, GenericComponent, POSITION_ITEM_FRONTEND } from "../lib/ui-lib/src";

function ComponentGetter({
  component_type,
  DefaultComponent,
  ...rest
}: POSITION_ITEM_FRONTEND) {
  const [showCoupon, setShowCoupon] = useState(false);
  const handleSkipClick = () => { 
    setShowCoupon(false);
  };

  useEffect(() => {

    if (true) {
      setShowCoupon(false);
    } else {
      setShowCoupon(true);
    }
  }, []);

  // if (component_type == "loyalty") return <LoyaltyBanner />;
  if (component_type == "Generic")
    return <GenericComponent {...rest} component_type={component_type} />;
  if (component_type == "Coupon") {
    if (showCoupon) {
      return (
        <CouponBanner
          {...rest}
          component_type={component_type}
          callBack={() => {
            handleSkipClick();
          }}
        />
      );
    }
    return null;
  }
  if (component_type == "Default" && DefaultComponent) return <DefaultComponent />;
  return <></>;
}
export default ComponentGetter;
