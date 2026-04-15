import FacilityPage from "../../components/facilities/FacilityPage"
import { FACILITIES } from "../../constants/facilitiesData"

const ICTInfrastructure = () => {
  const facility = FACILITIES.find((item) => item.id === "ict")
  return <FacilityPage facility={facility} activeTo="/facilities/ict" />
}

export default ICTInfrastructure
