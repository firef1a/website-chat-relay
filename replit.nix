{ pkgs }: {
	deps = with pkgs; [
		nodejs_18
		nodePackages.typescript-language-server
	];
}