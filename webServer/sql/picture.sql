CREATE DATABASE IF NOT EXISTS `jade_db` character set utf8 collate utf8_general_ci;
USE `jade_db`;
-- ------------------ 
-- 图片
-- ------------------
CREATE TABLE IF NOT EXISTS `t_picture` (
	`id` bigint(20) AUTO_INCREMENT COMMENT '唯一ID',
	`name` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '图片名',
	`content` varchar(20000) CHARACTER SET utf8 NOT NULL DEFAULT '' COMMENT '图片内容',
	`tm` int(10) NOT NULL DEFAULT 0 COMMENT '时间',
	`create_tm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
	PRIMARY KEY (id),
	KEY `name`(`name`) USING BTREE,
	KEY `tm`(`tm`) USING BTREE
)ENGINE=InnoDB AUTO_INCREMENT=1 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8 DEFAULT CHARSET=latin1;

