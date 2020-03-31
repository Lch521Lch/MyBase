<template>
<div class="login">
    <LoginHeader>
        <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-position="left" label-width="0px" slot="container">
            <div class="title">
                <h3>账号密码登录</h3>
            </div>
            <!-- username -->
            <el-form-item prop="username">
                <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号">
                    <i slot="prefix" class="el-icon-user"></i>
                </el-input>
            </el-form-item>

            <!-- password -->
            <el-form-item prop="password">
                <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码">
                    <i slot="prefix" class="el-icon-lock"></i>
                </el-input>
            </el-form-item>

            <!-- 登录button -->
            <el-form-item>
                <el-button :loading="isLogin" @click.native.prevent="handleSubmit" type="primary" style="width:100%;">登录</el-button>
            </el-form-item>

            <!-- 7天登录和忘记密码 -->
            <el-form-item> </el-form-item>
        </el-form>
    </LoginHeader>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue,
    Provide
} from "vue-property-decorator";
import {
    State,
    Getter,
    Mutation,
    Action
} from "vuex-class";
import {
    Base64
} from "js-base64";
import {
    AES,
    mode,
    pad,
    enc
} from "crypto-js";
import LoginHeader from "./LoginHeader.vue";

@Component({
    components: {
        LoginHeader
    }
})
export default class Login extends Vue {
    // 存储用户信息
    @Action("setUser") setUser: any;

    @Provide() isLogin: boolean = false;
    @Provide() ruleForm: {
        username: String;
        password: String;
        autoLogin: boolean;
    } = {
        username: "",
        password: "",
        autoLogin: true // 是否自动登录
    };

    @Provide() rules = {
        username: [{
            required: true,
            message: "请输入账号",
            trigger: "blur"
        }],
        password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
        }]
    };

    //aes加密
    encryptByEnAES(data: string): any {
        let iv = "0000000000000000";
        // 加密内容
        let message = "9999";
        // 密钥，长度必须为16
        let secret_key = "1234567890123456";

        // utf-8 转换
        message = enc.Utf8.parse(data);
        secret_key = enc.Utf8.parse(secret_key);
        iv = enc.Utf8.parse(iv);

        // Encrypt
        var ciphertext = AES.encrypt(data, secret_key, {
            iv: iv,
            mode: mode.CBC,
            padding: pad.Pkcs7
        });
        return ciphertext;
    }

    encryptByDeAES(data: string): string {
        let iv = "0000000000000000";
        // 加密内容

        // 密钥，长度必须为16
        let secret_key = "1234567890123456";

        secret_key = enc.Utf8.parse(secret_key);
        iv = enc.Utf8.parse(iv);
        let tmpDeAES = AES.decrypt(data, secret_key, {
            iv: iv,
            mode: mode.CBC,
            padding: pad.Pkcs7
        });
        return tmpDeAES.toString(enc.Utf8);
    }

    handleSubmit(): void {
        let tmpPass = this.ruleForm.password.toString();

        this.ruleForm.password = this.encryptByEnAES(tmpPass).ciphertext.toString();

         

        (this.$refs["ruleForm"] as any).validate((valid: boolean) => {
            if (valid) {
                console.log("校验通过");

                this.isLogin = true;

                (this as any).$axios
                    .post("/user/login", this.ruleForm)
                    .then((res: any) => {
                        this.isLogin = false;
                       
                        if (res.data.state == "error") {
                            this.$message({
                                message: res.data.msg,
                                type: res.data.state,
                                duration: 3000
                            });
                        } else {
                            localStorage.setItem("tsToken", res.data.token);

                           

                            localStorage.setItem("cityname", res.data.cityname);

                            localStorage.setItem("uername", res.data.uername);

                            // 存储到vuex中
                            this.setUser(res.data.token);

                            // 登录成功 跳转 /
                            this.$router.push("/");
                        }
                    })
                    .catch(() => {
                        this.isLogin = false;
                    });
            }
        });
    }
}

export class Base6464 {
    // private property
    private _keyStr =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    encode(input: string) {
        let output = "";
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output =
                output +
                this._keyStr.charAt(enc1) +
                this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) +
                this._keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    decode(input: string) {
        let output = "";
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    private _utf8_encode(string: string) {
        string = string.replace(/\r\n/g, "\n");
        let utftext = "";
        for (let n = 0; n < string.length; n++) {
            const c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    // private method for UTF-8 decoding
    private _utf8_decode(utftext: string) {
        let string = "";
        let i = 0;
        let c = 0,
            c2 = 0,
            c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(
                    ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
                );
                i += 3;
            }
        }
        return string;
    }
}
</script>

<style lang="scss" scoped>
.title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
}

i {
    font-size: 14px;
    margin-left: 8px;
}

.forget {
    float: right;
}
</style>
