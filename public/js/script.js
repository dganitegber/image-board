(function() {
    console.log("this works");
    new Vue({
        el: "#main",
        data: {
            heading: "Welcome to my image board!",
            latest: "Latest images",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            console.log("mounted");
            var vueInstance = this;
            axios
                .get("/candy")
                .then(function(res) {
                    vueInstance.images = res.data;
                })
                .catch(function(err) {
                    console.log("error in axios get candy: ", err);
                });
        },

        methods: {
            handleClick: function(e) {
                e.preventDefault();
                console.log("this: ", this, "33");
                //we use FormData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                // console.log('formData: ', formData);

                axios
                    .post("upload", formData)
                    .then(function(resp) {
                        console.log("resp form POST /upload: ", resp);
                    })
                    .catch(function(err) {
                        console.log("err in POST /upload: ", err);
                    });
            },
            handleChange: function(e) {
                console.log("handleChange is running");
                console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            }
        }
    });
})();
