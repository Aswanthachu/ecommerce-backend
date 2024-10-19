const t: { [key: string]: string } = {
  no_branches_found: "no_branches_found",
  no_countries_found: "no_countries_found",
  no_branch_special_time_found: "no_branch_special_time_found",
  branch_operational_time_not_found: "branch_operational_time_not_found",
  delivery_branch_mapping_not_found: "delivery_branch_mapping_not_found",
  branch_type_not_found: "branch_type_not_found",
  no_states_found: "no_states_found",
  update_successful: "update_successful",
  delete_successful: "delete_successful",
  update_failed: "update_failed",
  delete_failed: "delete_failed",
  an_error_occurred: "an_error_occurred",
  no_file_uploaded: "no_file_uploaded",
  invalid_uuid: "invalid_uuid",
} as const;

export { t };
