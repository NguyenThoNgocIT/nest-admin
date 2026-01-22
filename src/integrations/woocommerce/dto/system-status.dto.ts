import { ApiProperty } from '@nestjs/swagger'

export class SystemStatusEnvironmentDto {
  @ApiProperty()
  home_url: string

  @ApiProperty()
  site_url: string

  @ApiProperty()
  version: string

  @ApiProperty()
  log_directory: string

  @ApiProperty()
  log_directory_writable: boolean

  @ApiProperty()
  wp_version: string

  @ApiProperty()
  wp_multisite: boolean

  @ApiProperty()
  wp_memory_limit: number

  @ApiProperty()
  wp_debug_mode: boolean

  @ApiProperty()
  wp_cron: boolean

  @ApiProperty()
  wp_environment_type: string

  @ApiProperty()
  language: string

  @ApiProperty()
  server_info: string

  @ApiProperty()
  php_version: string

  @ApiProperty()
  php_post_max_size: number

  @ApiProperty()
  php_max_execution_time: number

  @ApiProperty()
  php_max_input_vars: number

  @ApiProperty()
  curl_version: string

  @ApiProperty()
  suhosin_installed: boolean

  @ApiProperty()
  max_upload_size: number

  @ApiProperty()
  mysql_version: string

  @ApiProperty()
  default_timezone: string

  @ApiProperty()
  fsockopen_or_curl_enabled: boolean

  @ApiProperty()
  soapclient_enabled: boolean

  @ApiProperty()
  domdocument_enabled: boolean

  @ApiProperty()
  gzip_enabled: boolean

  @ApiProperty()
  mbstring_enabled: boolean

  @ApiProperty()
  remote_post_successful: boolean

  @ApiProperty()
  remote_post_response: string

  @ApiProperty()
  remote_get_successful: boolean

  @ApiProperty()
  remote_get_response: string
}

export class SystemStatusDatabaseDto {
  @ApiProperty()
  wc_database_version: string

  @ApiProperty()
  database_prefix: string

  @ApiProperty()
  maxmind_geoip_database: string

  @ApiProperty()
  database_tables: Record<string, boolean>
}

export class SystemStatusPluginDto {
  @ApiProperty()
  plugin: string

  @ApiProperty()
  name: string

  @ApiProperty()
  version: string

  @ApiProperty()
  version_latest: string

  @ApiProperty()
  url: string

  @ApiProperty()
  author_name: string

  @ApiProperty()
  author_url: string

  @ApiProperty()
  network_activated: boolean
}

export class SystemStatusThemeDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  version: string

  @ApiProperty()
  version_latest: string

  @ApiProperty()
  author_url: string

  @ApiProperty()
  is_child_theme: boolean

  @ApiProperty()
  has_woocommerce_support: boolean

  @ApiProperty()
  has_woocommerce_file: boolean

  @ApiProperty()
  has_outdated_templates: boolean

  @ApiProperty({ type: [Object] })
  overrides: any[]

  @ApiProperty()
  parent_name: string

  @ApiProperty()
  parent_version: string

  @ApiProperty()
  parent_version_latest: string

  @ApiProperty()
  parent_author_url: string
}

export class SystemStatusSettingsDto {
  @ApiProperty()
  api_enabled: boolean

  @ApiProperty()
  force_ssl: boolean

  @ApiProperty()
  currency: string

  @ApiProperty()
  currency_symbol: string

  @ApiProperty()
  currency_position: string

  @ApiProperty()
  thousand_separator: string

  @ApiProperty()
  decimal_separator: string

  @ApiProperty()
  number_of_decimals: number

  @ApiProperty()
  geolocation_enabled: boolean

  @ApiProperty()
  taxonomies: Record<string, string>
}

export class SystemStatusSecurityDto {
  @ApiProperty()
  secure_connection: boolean

  @ApiProperty()
  hide_errors: boolean
}

export class SystemStatusPageDto {
  @ApiProperty()
  page_name: string

  @ApiProperty()
  page_id: string

  @ApiProperty()
  page_set: boolean

  @ApiProperty()
  page_exists: boolean

  @ApiProperty()
  page_visible: boolean

  @ApiProperty()
  shortcode: string

  @ApiProperty()
  shortcode_required: boolean

  @ApiProperty()
  shortcode_present: boolean
}

export class SystemStatusDto {
  @ApiProperty({ type: SystemStatusEnvironmentDto })
  environment: SystemStatusEnvironmentDto

  @ApiProperty({ type: SystemStatusDatabaseDto })
  database: SystemStatusDatabaseDto

  @ApiProperty({ type: [SystemStatusPluginDto] })
  active_plugins: SystemStatusPluginDto[]

  @ApiProperty({ type: SystemStatusThemeDto })
  theme: SystemStatusThemeDto

  @ApiProperty({ type: SystemStatusSettingsDto })
  settings: SystemStatusSettingsDto

  @ApiProperty({ type: SystemStatusSecurityDto })
  security: SystemStatusSecurityDto

  @ApiProperty({ type: [SystemStatusPageDto] })
  pages: SystemStatusPageDto[]
}
