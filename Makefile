# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Design Theme
LUCI_PKGARCH:=all
LUCI_DEPENDS:=+luci
PKG_VERSION:=5.8.0-20240106
PKG_RELEASE:=1

# Including Luci framework build rules
include $(TOPDIR)/feeds/luci/luci.mk

# Package build definition
define Package/luci-theme-design
  SECTION:=luci
  CATEGORY:=LuCI
  TITLE:=Design theme for LuCI
  DEPENDS:=+luci
endef

define Package/luci-theme-design/description
  A modern design theme for LuCI web interface.
endef

# Building the theme files
define Build/Compile
    $(MAKE) -C $(PKG_BUILD_DIR) install
endef

# Package installation steps
define Package/luci-theme-design/install
    $(INSTALL_DIR) $(1)/www/luci-static/
    $(CP) -r $(PKG_BUILD_DIR)/files/* $(1)/www/luci-static/
endef

$(eval $(call BuildPackage,luci-theme-design))
